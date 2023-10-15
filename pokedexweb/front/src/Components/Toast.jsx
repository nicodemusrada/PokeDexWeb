import { useEffect, useState } from "react";

export function Toast({ message, type }) {
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      setVisible(true);
  
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 3000); // Hide the notification after 3 seconds
  
      return () => {
        clearTimeout(timeout);
      };
    }, [message]);
  
    return visible ? (
      <div className={`notification ${type}`}>
        {message}
      </div>
    ) : null;
  };