import * as React from 'react';
import ReactMinimalProgressSteps from '../src/ReactMinimalProgressSteps';
import type { ProgressStepOption } from '../src/ReactMinimalProgressSteps';

export interface ProgressBarWithStagesParams {
  options: ProgressStepOption[];
  selectedValue: number | null;
  onChange: (value: number | null) => void;
  isDisabled: boolean;
  defaultValue?: number;
}

export interface ProgressBarWithStagesProps {
  params: ProgressBarWithStagesParams;
}

const ProgressBarWithStages: React.FC<ProgressBarWithStagesProps> = ({ params }) => {
  const [selectedValue, setSelectedValue] = React.useState<number | null>(
    params.selectedValue ?? null
  );

  React.useEffect(() => {
    setSelectedValue(params.selectedValue ?? null);
  }, [params.selectedValue]);

  const handleChange = React.useCallback(
    (value: number) => {
      setSelectedValue(value);
      params.onChange(value);
    },
    [params]
  );

  return (
    <div
      style={{
        marginTop: 4,
        marginLeft: 68,
        marginRight: 68,
        marginBottom: 43,
      }}
    >
      <ReactMinimalProgressSteps
        data={params.options}
        selectedValue={selectedValue}
        onSelect={handleChange}
        nextButtonText="Next"
        prevButtonText="Prev"
      />
    </div>
  );
};

export default ProgressBarWithStages;
