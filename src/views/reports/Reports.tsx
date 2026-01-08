import { ReportContainer } from '@/features/reporting/components';
import { TitleAndDesc } from '@/shared/components';

const Reports = () => {
  return (
    <main className='space-y-6'>
      <TitleAndDesc
        title='Reporting'
        subtitle='Generate and export comprehensive system reports'
      />
      <ReportContainer />
    </main>
  );
};
export default Reports;
