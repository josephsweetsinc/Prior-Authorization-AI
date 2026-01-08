"""Pydantic schemas for statistics endpoints."""

from pydantic import BaseModel, Field


class ProviderStatsResponseSchema(BaseModel):
    """Statistics response for provider."""

    total_requests: int = Field(description='Total number of requests')
    approved: int = Field(description='Number of approved requests')
    submitted: int = Field(description='Number of submitted requests')
    rejected: int = Field(description='Number of rejected (denied) requests')


class AdminUserItemSchema(BaseModel):
    """Schema for admin user item."""

    full_name: str = Field(description='Full name of the admin user')
    email: str = Field(description='Email of the admin user')


class AdminUsersResponseSchema(BaseModel):
    """Response schema for admin users endpoint."""

    full_name: str = Field(description='Full name of the current admin')
    email: str = Field(description='Email of the current admin')
    recent_admins: list[AdminUserItemSchema] = Field(
        description='List of 3 most recently registered admin users'
    )
