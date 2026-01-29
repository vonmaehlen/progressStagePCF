import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ProgressBarWithStages from "./component/progressComponent";
import type { ProgressStepOption } from "./src/ReactMinimalProgressSteps";

const DEFAULT_OPTIONS: ComponentFramework.PropertyHelper.OptionMetadata[] = [
  { Value: 10, Label: "10% 1", Color: "#6B8E23" },
  { Value: 30, Label: "30% 3", Color: "#9ACD32" },
  { Value: 50, Label: "50% 5", Color: "#556B2F" },
  { Value: 70, Label: "70% 7", Color: "#ADFF2F" },
  { Value: 90, Label: "90% 9", Color: "#8FBC8F" },
  { Value: 100, Label: "100% 100", Color: "#006400" },
];

export class ProgressBarPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private dropdownOptions: ProgressStepOption[] = [];
  private selectedOptionValue: number | null = null;
  private container: HTMLDivElement;
  private notifyOutputChanged: () => void;

  constructor() {
    // PCF StandardControl
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    let opts = context.parameters.OptionSetField.attributes?.Options ?? [];
    if (opts.length === 3) {
      opts = DEFAULT_OPTIONS;
    }

    const allOptions: ComponentFramework.PropertyHelper.OptionMetadata[] = [
      { Label: "--Select--", Value: -1, Color: "#FFFFFF" },
      ...opts,
    ];

    this.dropdownOptions = allOptions.map((option, index) => ({
      Value: option.Value,
      Label: option.Label,
      Color: { color: option.Color },
      Id: index + 1,
    }));

    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;
    this.renderControl(context);
  }

  private renderControl(context: ComponentFramework.Context<IInputs>): void {
    const raw = context.parameters.OptionSetField.raw;
    this.selectedOptionValue = raw != null ? raw : null;

    const optionsForSteps = this.dropdownOptions.filter((o) => o.Value !== -1);

    const params = {
      options: optionsForSteps,
      selectedValue: this.selectedOptionValue,
      onChange: (newValue: number | null) => {
        this.selectedOptionValue = newValue;
        this.notifyOutputChanged();
      },
      isDisabled: context.mode.isControlDisabled,
      defaultValue: context.parameters.OptionSetField.attributes?.DefaultValue,
    };

    ReactDOM.render(
      React.createElement(ProgressBarWithStages, { params }),
      this.container
    );
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.renderControl(context);
  }

  public getOutputs(): IOutputs {
    return {
      OptionSetField:
        this.selectedOptionValue == null ? undefined : this.selectedOptionValue,
    };
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this.container);
  }
}
