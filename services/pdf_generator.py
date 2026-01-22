"""Service for generating CMS-10344 PDF forms."""

import io
import logging
from datetime import UTC, datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# Mocking the model for the script to run standalone if needed
# In your project, keep your original import: from models.ambulance_request import AmbulanceRequest
try:
    from models.ambulance_request import AmbulanceRequest
except ImportError:
    # Fallback for testing purely the layout without the app context
    class AmbulanceRequest:
        pass

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

        # Setup margins to match the clean look (approx 20mm margins)
        left_margin = 20 * mm
        right_margin = 20 * mm
        top_margin = 15 * mm
        bottom_margin = 20 * mm

        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=right_margin,
            leftMargin=left_margin,
            topMargin=top_margin,
            bottomMargin=bottom_margin,
        )

        story: list = []
        styles = getSampleStyleSheet()

        # --- Custom Styles ---

        # Header Styles
        header_title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Normal'],
            fontSize=22,
            leading=26,
            textColor=colors.white,
            fontName='Helvetica-Bold',
        )

        header_subtitle_style = ParagraphStyle(
            'HeaderSubtitle',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#E2E8F0'), # Off-white
            fontName='Helvetica',
        )

        header_time_style = ParagraphStyle(
            'HeaderTime',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#CBD5E1'),
            fontName='Helvetica',
            alignment=2, # Right align
        )

        # Section Header (1. PATIENT INFORMATION)
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#111827'), # Dark text
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold',
            textTransform='uppercase',
        )

        # Field Label (Tiny grey text above value)
        label_style = ParagraphStyle(
            'Label',
            parent=styles['Normal'],
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor('#6B7280'), # Cool gray
            fontName='Helvetica-Bold',
            textTransform='uppercase',
            spaceAfter=2,
        )

        # Field Value (The actual data)
        value_style = ParagraphStyle(
            'Value',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#000000'),
            fontName='Helvetica',
        )

        # --- Helper for "Label over Value" blocks ---
        def create_field(label_text, value_text):
            if value_text is None:
                value_text = 'N/A'
            return [
                Paragraph(label_text, label_style),
                Paragraph(str(value_text), value_style),
                Spacer(1, 4 * mm) # Space between fields vertically
            ]

        # --- Header Section ---

        generation_time = datetime.now(UTC).strftime('%b %d, %Y at %H:%M:%S UTC')

        # Calculate available width for the table
        available_width = A4[0] - left_margin - right_margin

        header_content = [
            [
                # Left Cell: Title + Subtitle
                [
                    Paragraph('CMS-10344', header_title_style),
                    Paragraph('Medicare Prior Authorization Request Form', header_subtitle_style),
                ],
                # Right Cell: Timestamp
                [
                    Paragraph(generation_time, header_time_style),
                ]
            ]
        ]

        header_table = Table(
            header_content,
            colWidths=[available_width * 0.7, available_width * 0.3],
        )

        header_bg_color = colors.HexColor('#1B3369') # The specific deep blue from screenshot

        header_table.setStyle(
            TableStyle(
                [
                    ('BACKGROUND', (0, 0), (-1, -1), header_bg_color),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (0, 0), 15), # Padding inside blue box
                    ('RIGHTPADDING', (-1, 0), (-1, 0), 15),
                    ('TOPPADDING', (0, 0), (-1, -1), 15),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
                ]
            )
        )
        story.append(header_table)
        story.append(Spacer(1, 10 * mm))

        # --- 1. PATIENT INFORMATION ---

        story.append(Paragraph('1. PATIENT INFORMATION', section_style))

        # Data preparation
        p_dob = request.patient_date_of_birth.strftime('%m-%d-%Y') if request.patient_date_of_birth else 'N/A'

        # We use a 2-column layout.
        # Column 1 fields
        col1_data = []
        col1_data.extend(create_field('FIRST NAME', request.patient_first_name))
        col1_data.extend(create_field('DATE OF BIRTH', p_dob))
        col1_data.extend(create_field('PRIMARY DIAGNOSIS', request.primary_diagnosis))

        # Column 2 fields
        col2_data = []
        col2_data.extend(create_field('LAST NAME', request.patient_last_name))
        col2_data.extend(create_field('PATIENT ID', request.patient_id))
        # Add empty spacer to align with Primary Diagnosis if needed, or leave empty

        # Master table for Section 1
        s1_table = Table(
            [[col1_data, col2_data]],
            colWidths=[available_width * 0.5, available_width * 0.5]
        )
        s1_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(s1_table)

        # Separator line
        story.append(Spacer(1, 5 * mm))
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#E5E7EB')))
        story.append(Spacer(1, 5 * mm))

        # --- 2. TRANSPORTATION INFORMATION ---

        story.append(Paragraph('2. TRANSPORTATION INFORMATION', section_style))

        t_type = request.transportation_type.value.upper() if request.transportation_type else 'N/A'
        t_date = request.date_of_transport.strftime('%m-%d-%Y') if request.date_of_transport else 'N/A'
        t_time = request.time_of_transport.strftime('%H:%M') if request.time_of_transport else 'N/A'

        # Row 1: Type & nothing (or full width if desired, but image implies columns)
        # Based on image, it looks like a grid.

        trans_col1 = []
        trans_col1.extend(create_field('TRANSPORTATION TYPE', t_type))
        trans_col1.extend(create_field('DATE OF TRANSPORT', t_date))
        trans_col1.extend(create_field('PICKUP ADDRESS', request.pickup_address))

        trans_col2 = []
        # Time aligns with Date in the image (2nd row of this section)
        # So we need a blank spacer for the first slot if we want to align strictly
        trans_col2.append(Spacer(1, 13 * mm)) # Approximate height of the first field
        trans_col2.extend(create_field('TIME OF TRANSPORT', t_time))

        s2_table_top = Table(
            [[trans_col1, trans_col2]],
            colWidths=[available_width * 0.5, available_width * 0.5]
        )
        s2_table_top.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(s2_table_top)

        # Destination Address (Full Width)
        # Using a 1-column table to keep alignment consistent
        dest_data = create_field('DESTINATION ADDRESS', request.destination_address)
        s2_table_bot = Table(
            [[dest_data]],
            colWidths=[available_width]
        )
        s2_table_bot.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(s2_table_bot)

        # Separator line
        story.append(Spacer(1, 2 * mm))
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#E5E7EB')))
        story.append(Spacer(1, 5 * mm))

        # --- 3. MEDICAL NECESSITY ---

        story.append(Paragraph('3. MEDICAL NECESSITY', section_style))

        # Justification
        med_justification_content = []
        med_justification_content.append(Paragraph('MEDICAL JUSTIFICATION', label_style))

        if request.medical_justification:
            for line in request.medical_justification.split('\n'):
                if line.strip():
                    med_justification_content.append(Paragraph(line.strip(), value_style))
        else:
            med_justification_content.append(Paragraph('N/A', value_style))

        med_justification_content.append(Spacer(1, 8 * mm))

        # Signature
        signature_status = 'Signed' if request.ordering_physician else 'Not Signed'
        med_justification_content.extend(create_field('PHYSICIAN SIGNATURE', signature_status))

        # Render section 3
        s3_table = Table(
            [[med_justification_content]],
            colWidths=[available_width]
        )
        s3_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(s3_table)

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        pdf_bytes = buffer.read()

        logger.info(
            'Generated CMS-10344 PDF for request %s (size: %d bytes)',
            getattr(request, 'id', 'unknown'),
            len(pdf_bytes),
        )

        return pdf_bytes