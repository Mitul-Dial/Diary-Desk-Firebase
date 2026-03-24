import React from "react";

function Alert(props) {
  return (
    <div style={{
      position: 'fixed',
      top: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 300,
      width: '100%',
      maxWidth: 400,
      padding: '0 var(--spacing-lg)'
    }}>
      {props.alert && (
        <div className={`alert alert-${props.alert.type}`} role="alert">
          <span style={{ fontWeight: 500 }}>
            {props.alert.type === 'danger' ? '✕' : props.alert.type === 'success' ? '✓' : '!'}
          </span>
          <span>{props.alert.msg}</span>
        </div>
      )}
    </div>
  );
}

export default Alert;