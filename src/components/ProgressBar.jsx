import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ progress, total, show, label }) => {
  if (!show || total === 0) return null;

  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="row mt-2">
      <div className="col-md-12">
        <div className="progress-container">
          <p className="progress-text">
            {label ? label : `${progress}/${total} records uploaded`}
          </p>
          <div className="progress-bar-background mt-3">
            <div
              className="progress-bar"
              style={{ width: `${percentage}%` }}
            >
              {percentage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  show: PropTypes.bool,
  label: PropTypes.string,
};

ProgressBar.defaultProps = {
  show: true,
  label: "",
};

export default ProgressBar;

