"use client";

import { useState } from "react";
import { Button, Input } from "antd";
import { Search } from "lucide-react";

export interface BookingFilterSearchToggleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function BookingFilterSearchToggle({
  value,
  onChange,
  placeholder,
}: BookingFilterSearchToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded && !value) {
    return <Button icon={<Search size={16} />} onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Input
      autoFocus={isExpanded}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => {
        if (!value) setIsExpanded(false);
      }}
      allowClear
      style={{ width: 240 }}
    />
  );
}
