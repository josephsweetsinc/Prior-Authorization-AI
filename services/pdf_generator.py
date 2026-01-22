"""Service for generating CMS-10344 PDF forms."""

import io
import logging
from datetime import UTC, datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from models.ambulance_request import AmbulanceRequest

logger = logging.getLogger(__name__)


class PDFGeneratorService:
    """Service for generating CMS-10344 PDF forms."""

    def generate_cms_10344_pdf(
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
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.75 * inch,
            leftMargin=0.75 * inch,
            topMargin=0.5 * inch,
            bottomMargin=0.75 * inch,
        )
        story: list = []
        styles = getSampleStyleSheet()

        # Custom styles
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#000000'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold',
        )

        label_style = ParagraphStyle(
            'Label',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#000000'),
            fontName='Helvetica',
        )

        value_style = ParagraphStyle(
            'Value',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#000000'),
            fontName='Helvetica',
        )

        # Header with dark blue background
        generation_time = datetime.now(UTC).strftime('%b %d, %Y at %H:%M:%S UTC')
        
        # Header layout: CMS-10344 and form name on left, timestamp on right
        header_left = (
            f'<font size="20" color="white"><b>CMS-10344</b></font><br/>'
            f'<font size="14" color="white">'
            f'Medicare Prior Authorization Request Form</font>'
        )
        header_right = (
            f'<font size="10" color="white">{generation_time}</font>'
        )
        
        header_table = Table(
            [
                [
                    Paragraph(header_left, styles['Normal']),
                    Paragraph(header_right, styles['Normal']),
                ]
            ],
            colWidths=[5.5 * inch, 1.5 * inch],
        )
        header_table.setStyle(
            TableStyle(
                [
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a365d')),
                    ('VALIGN', (0, 0), (-1, 0), 'TOP'),
                    ('LEFTPADDING', (0, 0), (0, 0), 12),
                    ('RIGHTPADDING', (1, 0), (1, 0), 12),
                    ('TOPPADDING', (0, 0), (-1, -1), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ]
            )
        )
        story.append(header_table)
        story.append(Spacer(1, 0.3 * inch))

        # 1. PATIENT INFORMATION
        story.append(
            Paragraph(
                '1. PATIENT INFORMATION:',
                section_style,
            )
        )

        # Two-column layout for patient information
        # Left column: FIRST NAME, DATE OF BIRTH, PRIMARY DIAGNOSIS
        # Right column: LAST NAME, PATIENT ID
        patient_left_data = [
            [
                Paragraph('FIRST NAME:', label_style),
                Paragraph(request.patient_first_name or 'N/A', value_style),
            ],
            [
                Paragraph('DATE OF BIRTH:', label_style),
                Paragraph(
                    request.patient_date_of_birth.strftime('%m-%d-%Y')
                    if request.patient_date_of_birth
                    else 'N/A',
                    value_style,
                ),
            ],
            [
                Paragraph('PRIMARY DIAGNOSIS:', label_style),
                Paragraph(
                    request.primary_diagnosis or 'N/A',
                    value_style,
                ),
            ],
        ]
        
        patient_right_data = [
            [
                Paragraph('LAST NAME:', label_style),
                Paragraph(request.patient_last_name or 'N/A', value_style),
            ],
            [
                Paragraph('PATIENT ID:', label_style),
                Paragraph(request.patient_id or 'N/A', value_style),
            ],
        ]

        patient_table = Table(
            [
                [
                    Table(patient_left_data, colWidths=[1.8 * inch, 1.7 * inch]),
                    Table(patient_right_data, colWidths=[1.8 * inch, 1.7 * inch]),
                ]
            ],
            colWidths=[3.5 * inch, 3.5 * inch],
        )
        patient_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(patient_table)
        story.append(Spacer(1, 0.2 * inch))
        story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#000000')))
        story.append(Spacer(1, 0.2 * inch))

        # 2. TRANSPORTATION INFORMATION
        story.append(
            Paragraph(
                '2. TRANSPORTATION INFORMATION:',
                section_style,
            )
        )

        # Two-column layout for transportation information
        # Left column: TRANSPORTATION TYPE, DATE OF TRANSPORT, PICKUP ADDRESS
        # Right column: TIME OF TRANSPORT
        transport_left_data = [
            [
                Paragraph('TRANSPORTATION TYPE:', label_style),
                Paragraph(
                    request.transportation_type.value.upper()
                    if request.transportation_type
                    else 'N/A',
                    value_style,
                ),
            ],
            [
                Paragraph('DATE OF TRANSPORT:', label_style),
                Paragraph(
                    request.date_of_transport.strftime('%m-%d-%Y')
                    if request.date_of_transport
                    else 'N/A',
                    value_style,
                ),
            ],
            [
                Paragraph('PICKUP ADDRESS:', label_style),
                Paragraph(request.pickup_address or 'N/A', value_style),
            ],
        ]
        
        transport_right_data = [
            [
                Paragraph('TIME OF TRANSPORT:', label_style),
                Paragraph(
                    request.time_of_transport.strftime('%H:%M')
                    if request.time_of_transport
                    else 'N/A',
                    value_style,
                ),
            ],
        ]

        transport_table = Table(
            [
                [
                    Table(transport_left_data, colWidths=[1.8 * inch, 1.7 * inch]),
                    Table(transport_right_data, colWidths=[1.8 * inch, 1.7 * inch]),
                ]
            ],
            colWidths=[3.5 * inch, 3.5 * inch],
        )
        transport_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(transport_table)
        
        # DESTINATION ADDRESS on full width
        story.append(Spacer(1, 0.1 * inch))
        destination_table = Table(
            [
                [
                    Paragraph('DESTINATION ADDRESS:', label_style),
                    Paragraph(request.destination_address or 'N/A', value_style),
                ]
            ],
            colWidths=[1.8 * inch, 5.2 * inch],
        )
        destination_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(destination_table)
        story.append(Spacer(1, 0.2 * inch))
        story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#000000')))
        story.append(Spacer(1, 0.2 * inch))

        # 3. MEDICAL NECESSITY
        story.append(
            Paragraph(
                '3. MEDICAL NECESSITY:',
                section_style,
            )
        )

        # Medical Justification
        story.append(Paragraph('MEDICAL JUSTIFICATION:', label_style))
        if request.medical_justification:
            # Split long text into multiple paragraphs if needed
            justification_lines = request.medical_justification.split('\n')
            for line in justification_lines:
                if line.strip():
                    story.append(
                        Paragraph(
                            line.strip(),
                            value_style,
                        )
                    )
        else:
            story.append(Paragraph('N/A', value_style))

        story.append(Spacer(1, 0.2 * inch))

        # Physician Signature - just "Signed" if present
        signature_status = 'Signed' if request.ordering_physician else 'Not Signed'
        signature_table = Table(
            [
                [
                    Paragraph('PHYSICIAN SIGNATURE:', label_style),
                    Paragraph(signature_status, value_style),
                ]
            ],
            colWidths=[1.8 * inch, 5.2 * inch],
        )
        signature_table.setStyle(
            TableStyle(
                [
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(signature_table)

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        pdf_bytes = buffer.read()

        logger.info(
            'Generated CMS-10344 PDF for request %s (size: %d bytes)',
            request.id,
            len(pdf_bytes),
        )

        return pdf_bytes
