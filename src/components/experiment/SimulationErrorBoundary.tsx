import {
  Component,
  Fragment,
} from "react";

import type {
  ErrorInfo,
  ReactNode,
} from "react";

import Button from "../ui/Button";

export type SimulationErrorBoundaryProps = {
  children: ReactNode;

  onError?: (
    error: Error,
    info: ErrorInfo,
  ) => void;
};

type SimulationErrorBoundaryState = {
  hasError: boolean;
  retryKey: number;
};

export default class SimulationErrorBoundary extends Component<
  SimulationErrorBoundaryProps,
  SimulationErrorBoundaryState
> {
  state: SimulationErrorBoundaryState = {
    hasError: false,
    retryKey: 0,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ) {
    console.error(
      "Simulation rendering failed.",
      error,
      info,
    );

    this.props.onError?.(
      error,
      info,
    );
  }

  handleRetry = () => {
    this.setState(
      (state) => ({
        hasError: false,
        retryKey:
          state.retryKey + 1,
      }),
    );
  };

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <div
          className="simulation-error"
          role="alert"
          aria-live="assertive"
        >
          <div className="simulation-error__content">
            <strong className="simulation-error__title">
              Không thể tải mô phỏng 3D
            </strong>

            <p className="simulation-error__message">
              Đã xảy ra lỗi trong vùng mô phỏng.
              Bạn có thể thử khởi tạo lại mô phỏng.
            </p>

            <div className="simulation-error__actions">
              <Button
                type="button"
                className="experiment-template__button experiment-template__button--primary"
                onClick={
                  this.handleRetry
                }
              >
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Fragment
        key={
          this.state.retryKey
        }
      >
        {this.props.children}
      </Fragment>
    );
  }
}