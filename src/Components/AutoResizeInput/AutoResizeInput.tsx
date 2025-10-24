import { useEffect, useRef, type InputHTMLAttributes } from "react";

export const AutoResizeInput = (
  props: InputHTMLAttributes<HTMLInputElement>,
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef?.current) return;
    inputRef.current.style.width =
      inputRef.current.value.toString().length + 1 + "ch";
  }, [props.value]);
  return <input {...props} ref={inputRef} />;
};
