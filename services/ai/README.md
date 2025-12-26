# AI Extraction Service - Архитектура и процесс работы

## 📋 Обзор

AI сервис извлекает структурированные данные из медицинских документов (PDF, изображения) используя **GPT-4 Vision** через **LangChain**. Система обрабатывает до 5 документов одновременно, объединяет информацию из всех документов и возвращает валидированные данные в формате Pydantic.

---

## 🏗️ Архитектура компонентов

### 1. **AIExtractionService** (`extractor.py`)
Основной сервис для извлечения данных из документов.

**Зависимости:**
- `S3Actions` - для загрузки файлов из S3
- `DocumentProcessor` - для конвертации документов в изображения
- `ChatOpenAI` (LLM) - через dependency injection из `dependencies/ai.py`

**Основные методы:**
- `extract_data_from_files()` - главный метод извлечения
- `_download_file_from_s3()` - загрузка файлов из S3
- `_prepare_images_from_files()` - подготовка изображений из всех файлов
- `_build_message_content()` - формирование сообщения для LLM

### 2. **DocumentProcessor** (`document_processor.py`)
Обрабатывает документы и конвертирует их в формат для Vision API.

**Поддерживаемые форматы:**
- PDF → рендеринг всех страниц в изображения (PyMuPDF)
- PNG, JPEG, JPG, GIF, WEBP → нормализация и конвертация в PNG

**Процесс обработки:**
1. PDF: каждая страница рендерится в изображение с DPI=150 (настраивается)
2. Изображения: конвертируются в RGB и нормализуются
3. Все изображения кодируются в base64 для передачи в API

### 3. **EXTRACTION_SYSTEM_PROMPT** (`prompts.py`)
Системный промпт для LLM, который:
- Определяет роль AI как эксперта по медицинским документам
- Описывает что именно нужно извлекать
- Устанавливает правила обработки (не додумывать, возвращать null если не найдено)

---

## 🔄 Полный процесс работы (Step-by-Step)

### Шаг 1: Пользователь загружает документы
**Endpoint:** `POST /api/v1/ambulance-request/upload`

Пользователь отправляет до 5 файлов через FastAPI `UploadFile`.

### Шаг 2: Загрузка файлов в S3
**Код:** `AmbulanceRequestService.upload_files()`

```python
# Для каждого файла:
1. Валидация (размер, тип файла)
2. Загрузка в S3 (путь: users/{user_id}/ambulance-requests/...)
3. Создание записи в БД (RequestFile) с s3_key
```

### Шаг 3: Вызов AI сервиса
**Код:** `AIExtractionService.extract_data_from_files()`

Получает список `s3_keys` (путей к файлам в S3).

### Шаг 4: Загрузка файлов из S3
**Метод:** `_download_file_from_s3()`

```python
for s3_key in file_s3_keys:
    file_bytes, content_type = await download_from_s3(s3_key)
```

### Шаг 5: Конвертация документов в изображения
**Метод:** `_prepare_images_from_files()`

```python
for each file:
    if PDF:
        → DocumentProcessor.render_pdf_pages()
        → Каждая страница → PIL Image → base64
    elif Image (PNG/JPEG/etc):
        → DocumentProcessor.process_image()
        → Нормализация → base64
    
    result: list[(base64_data, 'image/png')]
```

**Детали обработки PDF:**
- Используется PyMuPDF (fitz) для рендеринга
- Zoom factor = DPI / 72 (базовый DPI PDF)
- Каждая страница → PNG изображение → base64 строка

### Шаг 6: Формирование сообщения для LLM
**Метод:** `_build_message_content()`

Создается структура сообщения:
```python
messages = [
    SystemMessage(content=EXTRACTION_SYSTEM_PROMPT),  # Инструкции для AI
    HumanMessage(content=[
        {'type': 'text', 'text': 'Проанализируйте документы...'},
        {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,...'}},  # Изображение 1
        {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,...'}},  # Изображение 2
        # ... все изображения из всех документов
    ])
]
```

### Шаг 7: Вызов GPT-4 Vision с Structured Output
**Метод:** `extract_data_from_files()` → LLM call

```python
# Настройка LLM для structured output
llm_with_structure = self._llm.with_structured_output(
    ExtractedTransportationData,  # Pydantic модель
    method='json_schema',         # Использует JSON Schema
    strict=True                    # Строгая валидация
)

# Асинхронный вызов
extracted_data = await llm_with_structure.ainvoke(messages)
```

**Что происходит:**
1. LangChain отправляет промпт + изображения в OpenAI API
2. GPT-4 Vision анализирует все изображения
3. LLM извлекает информацию согласно промпту
4. LangChain валидирует ответ через Pydantic схему
5. Возвращается `ExtractedTransportationData` объект

### Шаг 8: Формирование ответа
**Возвращается:** `AIExtractionResponse`

```python
AIExtractionResponse(
    extracted_data=ExtractedTransportationData(
        transportation_type=...,
        patient_first_name=...,
        patient_last_name=...,
        # ... все поля
    ),
    confidence_score=0.85,
    extraction_metadata={
        'status': 'success',
        'files_processed': '3',
        'images_analyzed': '5',
        'model': 'gpt-4.1'
    }
)
```

### Шаг 9: Возврат на фронтенд
**Endpoint возвращает:** `FileUploadWithExtractionResponseSchema`

```json
{
    "files": [...],  // Информация о загруженных файлах
    "extracted_data": {
        "transportation_type": "ambulance",
        "patient_first_name": "John",
        // ... извлеченные данные
    },
    "confidence_score": 0.85
}
```

### Шаг 10: Пользователь редактирует данные
Пользователь видит предзаполненную форму, может исправить данные.

### Шаг 11: Сохранение финальных данных
**Endpoint:** `POST /api/v1/ambulance-request/create`

Сохранение в БД с статусом `PROCESSING`.

---

## 🎯 Что извлекает AI

### Поля из `ExtractedTransportationData`:

1. **Информация о пациенте:**
   - `patient_first_name` - имя
   - `patient_last_name` - фамилия
   - `patient_date_of_birth` - дата рождения (нормализована в YYYY-MM-DD)
   - `patient_id` - Medicare ID или другой идентификатор

2. **Детали транспортировки:**
   - `transportation_type` - тип (ambulance, wheelchair, stretcher, bls, als, cct)
   - `date_of_transport` - дата транспортировки
   - `time_of_transport` - время (HH:MM, 24-часовой формат)
   - `pickup_address` - адрес отправления (полный адрес)
   - `destination_address` - адрес назначения

3. **Медицинская информация:**
   - `primary_diagnosis` - основной диагноз (с ICD-10 кодом если есть)
   - `medical_justification` - обоснование медицинской необходимости
   - `form_number` - номер формы CMS (например, CMS-10344)

---

## 🔧 Конфигурация

### Настройки в `.env`:
```env
LLM_OPENAI_API_KEY=sk-...
LLM_MODEL_NAME=gpt-4.1
LLM_TEMPERATURE=0.0          # Детерминированность
LLM_MAX_TOKENS=4096
LLM_PDF_RENDER_DPI=150       # Качество рендеринга PDF
```

### Зависимости:
- `langchain` - основной фреймворк
- `langchain-openai` - интеграция с OpenAI
- `pymupdf` (fitz) - рендеринг PDF
- `pillow` - обработка изображений

---

## 🛡️ Обработка ошибок

### Сценарии:

1. **Нет файлов:**
   ```python
   return AIExtractionResponse(
       extracted_data=ExtractedTransportationData(),  # Все поля None
       confidence_score=None,
       extraction_metadata={'status': 'no_files'}
   )
   ```

2. **Не удалось извлечь изображения:**
   ```python
   extraction_metadata={'status': 'no_images', 'note': '...'}
   ```

3. **Ошибка LLM:**
   ```python
   extraction_metadata={'status': 'error', 'note': 'AI extraction failed'}
   ```

4. **Неподдерживаемый формат:**
   - Файл пропускается, логируется warning
   - Остальные файлы обрабатываются

---

## 🚀 Особенности реализации

### 1. **Structured Output (JSON Schema)**
Используется `with_structured_output()` для гарантированной валидации:
- LLM возвращает JSON согласно Pydantic схеме
- Автоматическая валидация типов
- `strict=True` - строгая проверка

### 2. **Объединение данных из нескольких документов**
- Все изображения из всех файлов отправляются в одном запросе
- LLM анализирует все документы вместе
- Промпт явно указывает: "combine information from all of them"

### 3. **Асинхронная обработка**
- Все I/O операции асинхронные (S3, LLM API)
- CPU-интенсивные операции (рендеринг PDF) в thread pool через `asyncio.to_thread()`

### 4. **Base64 кодирование**
- Изображения кодируются в base64 для передачи в Vision API
- Формат: `data:image/png;base64,{base64_string}`
- `detail: 'high'` - максимальное качество для Vision API

---

## 📊 Пример потока данных

```
[Пользователь]
    ↓ (загружает 3 PDF файла)
[FastAPI Endpoint]
    ↓ (валидация, загрузка в S3)
[AmbulanceRequestService]
    ↓ (s3_keys: ['path1', 'path2', 'path3'])
[AIExtractionService]
    ↓ (загрузка из S3)
[DocumentProcessor]
    ↓ (PDF → 5 изображений total)
[Base64 encoding]
    ↓ (5 base64 строк)
[LangChain + GPT-4 Vision]
    ↓ (анализ всех изображений)
[Pydantic Validation]
    ↓ (ExtractedTransportationData)
[AIExtractionResponse]
    ↓ (возврат на фронтенд)
[Пользователь видит предзаполненную форму]
```

---

## ✅ Преимущества текущей архитектуры

1. **Модульность** - каждый компонент отвечает за свою задачу
2. **Тестируемость** - легко мокать зависимости
3. **Расширяемость** - легко добавить новые форматы или LLM провайдеры
4. **Валидация** - Pydantic гарантирует корректность данных
5. **Обработка ошибок** - graceful degradation при проблемах
6. **Производительность** - асинхронная обработка, параллельная загрузка файлов

---

## 🔮 Возможные улучшения

1. **Кеширование** - кешировать результаты для одинаковых документов
2. **Retry логика** - повторные попытки при ошибках API
3. **Streaming** - для больших документов
4. **Batch processing** - обработка нескольких запросов параллельно
5. **Confidence scoring** - более точная оценка уверенности AI
6. **Multi-model fallback** - резервный LLM при недоступности основного





