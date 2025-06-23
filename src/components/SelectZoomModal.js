import React from "react";
import { Modal, Button } from "react-bootstrap";

const SelectZoomModal = ({
  show,
  onHide,
  headers,
  items,
  onSelect,
  title = "Select The Zoom Meetings",
}) => {
  return (
    <Modal show={show} onHide={onHide} className="modal-xl">
      <Modal.Header className="customModal" style={{ position: "relative" }}>
        <Modal.Title>{title}</Modal.Title>
        <Button
          style={{
            position: "absolute",
            right: "15px",
            color: "orange",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "40px",
          }}
          aria-label="Close"
          onClick={onHide}
        >
          &times;
        </Button>
      </Modal.Header>

      <Modal.Body>
        <div className="table-responsive">
          {items.length > 0 && (
            <table className="table table-striped table-bordered table-hover mt-3 text-center">
              <thead>
                <tr>
                  <th>Select</th>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      maxHeight: "50px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    className="text-center custom_fz"
                  >
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelect(item)}
                      >
                        Select
                      </button>
                    </td>
                    {headers.map((header) => (
                      <td key={header}>{item[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectZoomModal;
