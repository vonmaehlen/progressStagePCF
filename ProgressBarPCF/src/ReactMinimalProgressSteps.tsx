import * as React from 'react';

export interface ProgressStepOption {
  Value: number;
  Label: string;
  Color: { color: string };
  Id: number;
}

export interface ReactMinimalProgressStepsProps {
  data: ProgressStepOption[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
  nextButtonText?: string;
  prevButtonText?: string;
}

const ReactMinimalProgressSteps: React.FC<ReactMinimalProgressStepsProps> = ({
  data = [],
  selectedValue,
  onSelect,
  nextButtonText = 'Next',
  prevButtonText = 'Prev',
}) => {
  const options = data.length >= 2 ? data : [];
  const selectedIndex = selectedValue != null
    ? options.findIndex((item) => item.Value === selectedValue)
    : -1;
  const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const progressWidthPercent =
    options.length > 1 ? (currentIndex / (options.length - 1)) * 100 : 0;

  const handleCircleClick = (item: ProgressStepOption): void => {
    onSelect(item.Value);
  };

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      onSelect(options[currentIndex - 1].Value);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < options.length - 1) {
      onSelect(options[currentIndex + 1].Value);
    }
  };

  if (options.length < 2) {
    return <div>Es werden mindestens 2 Optionen benötigt.</div>;
  }

  return (
    <div className="progress-steps">
      <div className="progress-steps__track">
        <div
          className="progress-steps__fill"
          style={{ transform: `translateY(-50%) scaleX(${progressWidthPercent / 100})` }}
        />
        {options.map((item) => {
          const itemIndex = options.findIndex((o) => o.Value === item.Value);
          const isActive = currentIndex > itemIndex;
          const isCurrent = currentIndex === itemIndex;
          const stepClass = [
            'progress-steps__step',
            isActive && 'progress-steps__step--active',
            isCurrent && 'progress-steps__step--current',
          ]
            .filter(Boolean)
            .join(' ');

          const stepColor = item.Color?.color || '#0078d4';
          const stepStyle: React.CSSProperties = isActive
            ? { backgroundColor: stepColor, borderColor: stepColor }
            : isCurrent
              ? { borderColor: stepColor, boxShadow: `0 0 0 3px ${stepColor}33` }
              : {};

          return (
            <div
              key={item.Value}
              className={stepClass}
              style={stepStyle}
              onClick={() => handleCircleClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCircleClick(item);
                }
              }}
              aria-label={item.Label}
            >
              {isActive && (
                <svg className="progress-steps__check" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <div className="progress-steps__label">{item.Label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReactMinimalProgressSteps;
