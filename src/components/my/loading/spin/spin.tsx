export const Spin = () => {
  return (
    <div className={`bg-app-pale rounded-full size-7 relative`}>
      <span
        //   initial={{ rotate: 0 }}
        //   animate={{ rotate: 360 }}
        //   transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
        className={`size-7 border-2 border-t-app-green absolute inset-0 rounded-full animate-spin`}
      />
    </div>
  );
};
