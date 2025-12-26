"""Metrics calculator for dashboard_metrics statistics."""

from collections.abc import Iterable
from datetime import date, timedelta

from models.ambulance_request import RequestStatus


class DashboardMetricsCalculator:
    """Static calculator for dashboard_metrics metrics.

    This class contains pure calculation methods without database access.
    All methods are static and operate on provided data.
    """

    @staticmethod
    def calculate_approval_rate(
        approved: int,
        denied: int,
    ) -> float:
        """Calculate approval rate percentage.

        Formula: approved / (approved + denied) * 100

        Args:
            approved: Number of approved requests.
            denied: Number of denied requests.

        Returns:
            Approval rate in percentage (0-100). Returns 0.0 if denominator 0.

        """
        denominator = approved + denied
        if not denominator:
            return 0.0
        return (approved / denominator) * 100

    @staticmethod
    def calculate_denial_rate(
        approved: int,
        denied: int,
    ) -> float:
        """Calculate denial rate percentage.

        Formula: denied / (approved + denied) * 100

        Args:
            approved: Number of approved requests.
            denied: Number of denied requests.

        Returns:
            Denial rate in percentage (0-100). Returns 0.0 if denominator is 0.

        """
        denominator = approved + denied
        if not denominator:
            return 0.0
        return (denied / denominator) * 100

    @staticmethod
    def calculate_percentage_change(
        current_value: int,
        previous_value: int,
    ) -> float:
        """Calculate percentage change between two values.

        Formula: ((current - previous) / previous) * 100

        Args:
            current_value: Current period value.
            previous_value: Previous period value.

        Returns:
            Percentage change. Returns 0.0 if previous_value is 0.

        """
        if not previous_value:
            return 0.0
        return ((current_value - previous_value) / previous_value) * 100

    @staticmethod
    def calculate_average_wait_time_hours(
        wait_durations_seconds: Iterable[float],
    ) -> float:
        """Calculate average wait time in hours from durations in seconds.

        Args:
            wait_durations_seconds: Iterable of wait durations in seconds.

        Returns:
            Average wait time in hours. Returns 0.0 if no durations provided.

        """
        durations_list = list(wait_durations_seconds)
        if not durations_list:
            return 0.0
        total_seconds = sum(durations_list)
        average_seconds = total_seconds / len(durations_list)
        return average_seconds / 3600

    @staticmethod
    def calculate_status_distribution_percentages(
        status_counts: list[tuple[RequestStatus, int]],
    ) -> list[tuple[RequestStatus, int, float]]:
        """Calculate percentage distribution for status counts.

        Args:
            status_counts: List of tuples (status, count).

        Returns:
            List of tuples (status, count, percentage).
            Percentages sum to 100.0 (or 0.0 if total is 0).

        """
        total = sum(count for _, count in status_counts)
        if not total:
            return [(status, count, 0.0) for status, count in status_counts]

        return [
            (status, count, (count / total) * 100)
            for status, count in status_counts
        ]

    @staticmethod
    def get_month_boundaries(
        reference_date: date,
    ) -> tuple[date, date, date, date]:
        """Get month boundaries for change calculation.

        Calculates:
        - Current month start
        - Last month start and end
        - Previous month start and end

        Args:
            reference_date: Reference date (usually today).

        Returns:
            Tuple of (
            last_month_start,
             last_month_end,
              prev_month_start,
               prev_month_end
               ).

        """
        current_month_start = reference_date.replace(day=1)
        last_month_end = current_month_start - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        prev_month_end = last_month_start - timedelta(days=1)
        prev_month_start = prev_month_end.replace(day=1)

        return (
            last_month_start,
            last_month_end,
            prev_month_start,
            prev_month_end,
        )

    @staticmethod
    def get_daily_period_boundaries(
        reference_date: date,
        days: int,
    ) -> tuple[date, date, date, date]:
        """Get period boundaries for daily change calculation.

        Calculates:
        - Current period: last N days (including reference_date)
        - Previous period: N days before current period

        Args:
            reference_date: Reference date (usually today).
            days: Number of days in period (e.g., 8 for 8-day period).

        Returns:
            Tuple of (current_start, current_end, previous_start, previous_end).

        """
        current_end = reference_date
        current_start = current_end - timedelta(days=days - 1)
        previous_end = current_start - timedelta(days=1)
        previous_start = previous_end - timedelta(days=days - 1)

        return (current_start, current_end, previous_start, previous_end)
