import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import datePickerCss from 'react-datepicker/dist/react-datepicker.css?url';

export default function LazyDatePicker(props) {
  useEffect(() => {
    const id = 'react-datepicker-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = datePickerCss;
      document.head.appendChild(link);
    }
  }, []);

  return <DatePicker {...props} />;
}
