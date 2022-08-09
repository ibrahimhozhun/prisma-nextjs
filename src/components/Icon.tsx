const Icon: React.FC<{
  icon: "error" | "success";
}> = ({ icon }) => {
  return (
    <svg
      style={{
        height: "40px",
        width: "40px",
      }}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      {icon === "success" ? (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      ) : (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      )}
    </svg>
  );
};

export default Icon;
