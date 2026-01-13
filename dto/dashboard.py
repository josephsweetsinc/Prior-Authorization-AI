from dataclasses import dataclass

from core.dto import BaseDTO


@dataclass(slots=True, frozen=True)
class RequestCountDTO(BaseDTO):
    """Data transfer object (DTO) for request counts."""

    approved_all: int = 0
    pending_all: int = 0
    denied_all: int = 0

    def _approval_denominator(self) -> int:
        return self.approved_all + self.denied_all

    @property
    def approval_rate(self) -> float:
        """Approval rate percentage as approved / (approved + denied)."""
        approval_denominator = self._approval_denominator()
        return (
            (self.approved_all / approval_denominator) * 100
            if approval_denominator
            else 0.0
        )

    @property
    def denial_rate(self) -> float:
        """Denial rate percentage calculated as denied / (approved + denied)."""
        approval_denominator = self._approval_denominator()
        return (
            (self.denied_all / approval_denominator) * 100
            if approval_denominator
            else 0.0
        )

    @property
    def total_requests(self) -> int:
        """Total number of requests."""
        return self.approved_all + self.pending_all + self.denied_all
