export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none cursor-pointer ${
        className ?? ''
      }`}
      {...props}
    />
  );
};

export default Button;
