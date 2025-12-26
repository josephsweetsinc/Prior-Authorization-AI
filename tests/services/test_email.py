"""Tests for EmailService."""

from unittest.mock import AsyncMock, patch

import pytest

from services.email import EmailService


class TestEmailService:
    """Test suite for EmailService."""

    @pytest.mark.asyncio
    async def test_send_password_reset_code(self):
        """Test sending password reset code email."""
        from config.settings import EmailSettings

        email_settings = EmailSettings(
            ADMIN_EMAIL='admin@example.com',
            SMTP_HOST='localhost',
            SMTP_PORT=587,
            USE_TLS=False,
        )

        service = EmailService(email_settings=email_settings)

        with patch.object(
            service, '_send_email', new_callable=AsyncMock
        ) as mock_send:
            await service.send_password_reset_code(
                email='user@example.com',
                code='12345',
            )

            mock_send.assert_called_once()
            call_args = mock_send.call_args
            assert call_args[1]['to_email'] == 'user@example.com'
            assert '12345' in call_args[1]['body']
            assert 'Password Reset Code' in call_args[1]['subject']

    @pytest.mark.asyncio
    async def test_send_email_with_tls(self):
        """Test sending email with TLS enabled."""
        from config.settings import EmailSettings

        email_settings = EmailSettings(
            ADMIN_EMAIL='admin@example.com',
            SMTP_HOST='localhost',
            SMTP_PORT=587,
            SMTP_USER='user',
            SMTP_PASSWORD='pass',
            USE_TLS=True,
        )

        service = EmailService(email_settings=email_settings)

        with patch('asyncio.to_thread', new_callable=AsyncMock) as mock_thread:
            mock_thread.return_value = None

            await service._send_email(
                to_email='user@example.com',
                subject='Test',
                body='Test body',
            )

            mock_thread.assert_called_once()
