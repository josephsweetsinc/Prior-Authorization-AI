import asyncio
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config.settings import EmailSettings, Settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails."""

    def __init__(
        self,
        *,
        email_settings: EmailSettings | None = None,
    ) -> None:
        """Initialize EmailService.

        Args:
            email_settings: Email settings. If None, loads from Settings.

        """
        settings = Settings.load()
        self._email_settings = email_settings or settings.email_settings

    async def send_password_reset_code(
        self,
        email: str,
        code: str,
    ) -> None:
        """Send password reset code to user's email.

        Args:
            email: User's email address.
            code: 5-digit password reset code.

        Raises:
            Exception: If email sending fails.

        """
        subject = 'Password Reset Code'
        body = (
            f'Your password reset code is: {code}\n\n'
            f'This code will expire in 15 minutes.'
        )

        try:
            await self._send_email(
                to_email=email,
                subject=subject,
                body=body,
            )
            logger.info('Password reset code sent to %s', email)
        except Exception:
            logger.exception('Failed to send password reset code to %s', email)
            raise

    async def _send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
    ) -> None:
        """Send an email.

        Args:
            to_email: Recipient email address.
            subject: Email subject.
            body: Email body.

        Raises:
            Exception: If email sending fails.

        """
        msg = MIMEMultipart()
        msg['From'] = self._email_settings.ADMIN_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        try:
            # Run synchronous SMTP operations in thread pool
            await asyncio.to_thread(self._send_sync_email, to_email, msg)
        except Exception:
            logger.exception('Failed to send email to %s', to_email)
            raise

    def _send_sync_email(self, to_email: str, msg: MIMEMultipart) -> None:
        """Send an email.

        Args:
            to_email: Recipient email address.
            msg: Email message.

        Raises:
            Exception: If email sending fails.

        """
        with smtplib.SMTP(
            self._email_settings.SMTP_HOST,
            self._email_settings.SMTP_PORT,
        ) as server:
            if self._email_settings.USE_TLS:
                server.starttls()

            if (
                self._email_settings.SMTP_USER
                and self._email_settings.SMTP_PASSWORD
            ):
                server.login(
                    self._email_settings.SMTP_USER,
                    self._email_settings.SMTP_PASSWORD,
                )

            server.send_message(msg)
