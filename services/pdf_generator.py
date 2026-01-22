"""Service for generating CMS-10344 PDF forms."""

import io
import logging
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

if TYPE_CHECKING:
    from reportlab.platypus.doctemplate import BaseDocTemplate

from models.ambulance_request import AmbulanceRequest

logger = logging.getLogger(__name__)


class PDFGeneratorService:
    """Service for generating CMS-10344 PDF forms."""

    def generate_cms_10344_pdf(  # noqa: PLR0915
        self,
        request: AmbulanceRequest,
    ) -> bytes:
        """Generate CMS-10344 Medicare Prior Authorization Request Form PDF.

        Args:
            request: AmbulanceRequest instance with all required fields.

        Returns:
            PDF file bytes.

        """
        buffer = io.BytesIO()

        # --- CONFIGURATION ---

        # Header color (matched to screenshot - saturated blue, not black)
        header_blue = colors.HexColor('#1E407C')

        # Margins for main content
        # topMargin is large to prevent text from overlapping the blue header
        left_margin = 15 * mm
        right_margin = 15 * mm
        top_margin = 40 * mm  # Top margin for content (below header)
        bottom_margin = 20 * mm

        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=right_margin,
            leftMargin=left_margin,
            topMargin=top_margin,
            bottomMargin=bottom_margin,
        )

        story: list[Any] = []
        styles = getSampleStyleSheet()

        # --- STYLES ---

        # Styles for Header Text (To be drawn on Canvas)
        header_title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Normal'],
            fontSize=22,
            leading=24,
            textColor=colors.white,
            fontName='Helvetica-Bold',
        )

        header_subtitle_style = ParagraphStyle(
            'HeaderSubtitle',
            parent=styles['Normal'],
            fontSize=11,
            leading=13,
            textColor=colors.HexColor('#E2E8F0'),
            fontName='Helvetica',
        )

        header_time_style = ParagraphStyle(
            'HeaderTime',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#BFDBFE'),  # Lighter blue-white for text
            fontName='Helvetica',
            alignment=2,  # Right align
        )

        # Body Styles
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#111827'),
            spaceAfter=10,
            spaceBefore=5,
            fontName='Helvetica-Bold',
            textTransform='uppercase',
        )

        label_style = ParagraphStyle(
            'Label',
            parent=styles['Normal'],
            fontSize=7.5,
            leading=9,
            textColor=colors.HexColor('#6B7280'),
            fontName='Helvetica-Bold',
            textTransform='uppercase',
            spaceAfter=2,
        )

        value_style = ParagraphStyle(
            'Value',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#000000'),
            fontName='Helvetica',
        )

        # --- DRAWING FUNCTION (The "Full Bleed" Header) ---

        def draw_header_on_canvas(
            canvas: Canvas, doc: 'BaseDocTemplate'
        ) -> None:
            """Draw blue header on page canvas to ignore margins."""
            page_width, page_height = A4
            header_height = 30 * mm  # Blue header height

            # 1. Draw blue rectangle from the very top (Full Bleed)
            canvas.saveState()
            canvas.setFillColor(header_blue)
            # rect(x, y, width, height)
            # y starts from bottom, so we calculate from top of page downward
            canvas.rect(
                0,
                page_height - header_height,
                page_width,
                header_height,
                stroke=0,
                fill=1,
            )

            # 2. Prepare header text
            generation_time = datetime.now(UTC).strftime(
                '%b %d, %Y at %H:%M:%S UTC'
            )

            # Left part (Titles)
            # Use Paragraph for styling, but draw it on canvas
            title_p = Paragraph('CMS-10344', header_title_style)
            subtitle_p = Paragraph(
                'Medicare Prior Authorization Request Form',
                header_subtitle_style,
            )

            # Right part (Time)
            time_p = Paragraph(generation_time, header_time_style)

            # 3. Position text (DrawOn)
            # Padding inside blue header
            padding_left = 15 * mm
            padding_right = 15 * mm
            padding_top = 6 * mm

            # Coordinates for Left part
            # wrap(available_width, available_height)
            title_w, title_h = title_p.wrap(page_width * 0.6, header_height)
            subtitle_w, subtitle_h = subtitle_p.wrap(
                page_width * 0.6, header_height
            )

            # Draw Title
            title_y = page_height - padding_top - title_h
            title_p.drawOn(canvas, padding_left, title_y)

            # Draw Subtitle slightly below
            subtitle_y = title_y - subtitle_h - 1
            subtitle_p.drawOn(canvas, padding_left, subtitle_y)

            # Coordinates for Right part
            time_w, time_h = time_p.wrap(page_width * 0.3, header_height)
            time_x = page_width - padding_right - time_w
            # Align time approximately at center of header height or at top
            time_y = (
                page_height - padding_top - time_h - 2 * mm
            )  # Slightly below top
            time_p.drawOn(canvas, time_x, time_y)

            canvas.restoreState()

        # --- HELPER ---
        def create_field(label_text: str, value_text: Any) -> list[Any]:
            """Create a field with label and value.

            Args:
                label_text: Field label text.
                value_text: Field value (will be converted to string).

            Returns:
                List of flowables: label paragraph, value paragraph, and spacer.

            """
            if value_text is None:
                value_text = 'N/A'
            return [
                Paragraph(label_text, label_style),
                Paragraph(str(value_text), value_style),
                Spacer(1, 4 * mm),
            ]

        # --- BUILDING BODY CONTENT ---

        available_width = A4[0] - left_margin - right_margin

        # 1. PATIENT INFORMATION
        story.append(Paragraph('1. PATIENT INFORMATION', section_style))

        p_dob = (
            request.patient_date_of_birth.strftime('%m-%d-%Y')
            if request.patient_date_of_birth
            else 'N/A'
        )

        col1_data: list[Any] = []
        col1_data.extend(create_field('FIRST NAME', request.patient_first_name))
        col1_data.extend(create_field('DATE OF BIRTH', p_dob))
        col1_data.extend(
            create_field('PRIMARY DIAGNOSIS', request.primary_diagnosis)
        )

        col2_data: list[Any] = []
        col2_data.extend(create_field('LAST NAME', request.patient_last_name))
        col2_data.extend(create_field('PATIENT ID', request.patient_id))

        s1_table = Table(
            [[col1_data, col2_data]],
            colWidths=[available_width * 0.5, available_width * 0.5],
        )
        s1_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(s1_table)

        story.append(Spacer(1, 5 * mm))
        story.append(
            HRFlowable(
                width='100%', thickness=0.5, color=colors.HexColor('#E5E7EB')
            )
        )
        story.append(Spacer(1, 5 * mm))

        # 2. TRANSPORTATION INFORMATION
        story.append(Paragraph('2. TRANSPORTATION INFORMATION', section_style))

        t_type = (
            request.transportation_type.value.upper()
            if request.transportation_type
            else 'N/A'
        )
        t_date = (
            request.date_of_transport.strftime('%m-%d-%Y')
            if request.date_of_transport
            else 'N/A'
        )
        t_time = (
            request.time_of_transport.strftime('%H:%M')
            if request.time_of_transport
            else 'N/A'
        )

        trans_col1: list[Any] = []
        trans_col1.extend(create_field('TRANSPORTATION TYPE', t_type))
        trans_col1.extend(create_field('DATE OF TRANSPORT', t_date))
        trans_col1.extend(
            create_field('PICKUP ADDRESS', request.pickup_address)
        )

        trans_col2: list[Any] = []
        trans_col2.append(Spacer(1, 13 * mm))  # Align under Type
        trans_col2.extend(create_field('TIME OF TRANSPORT', t_time))

        s2_table_top = Table(
            [[trans_col1, trans_col2]],
            colWidths=[available_width * 0.5, available_width * 0.5],
        )
        s2_table_top.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(s2_table_top)

        dest_data = create_field(
            'DESTINATION ADDRESS', request.destination_address
        )
        s2_table_bot = Table(
            [[dest_data]],
            colWidths=[available_width],
        )
        s2_table_bot.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(s2_table_bot)

        story.append(Spacer(1, 2 * mm))
        story.append(
            HRFlowable(
                width='100%', thickness=0.5, color=colors.HexColor('#E5E7EB')
            )
        )
        story.append(Spacer(1, 5 * mm))

        # 3. MEDICAL NECESSITY
        story.append(Paragraph('3. MEDICAL NECESSITY', section_style))

        med_justification_content: list[Any] = []
        med_justification_content.append(
            Paragraph('MEDICAL JUSTIFICATION', label_style)
        )

        if request.medical_justification:
            justification_paragraphs = [
                Paragraph(line.strip(), value_style)
                for line in request.medical_justification.split('\n')
                if line.strip()
            ]
            med_justification_content.extend(justification_paragraphs)
        else:
            med_justification_content.append(Paragraph('N/A', value_style))

        med_justification_content.append(Spacer(1, 8 * mm))

        signature_status = (
            'Signed' if request.ordering_physician else 'Not Signed'
        )
        med_justification_content.extend(
            create_field('PHYSICIAN SIGNATURE', signature_status)
        )

        s3_table = Table(
            [[med_justification_content]],
            colWidths=[available_width],
        )
        s3_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(s3_table)

        # BUILD PDF with Custom Header Callback
        # onFirstPage is responsible for rendering the header
        doc.build(story, onFirstPage=draw_header_on_canvas)

        buffer.seek(0)
        pdf_bytes = buffer.read()

        logger.info(
            'Generated CMS-10344 PDF for request %s (size: %d bytes)',
            getattr(request, 'id', 'unknown'),
            len(pdf_bytes),
        )

        return pdf_bytes
