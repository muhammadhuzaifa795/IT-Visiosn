import { Link } from "react-router";

const ForgotPasswordLink = () => {
  return (
    <div className="text-center mt-4">
      <Link 
        to="/password-reset" 
        className="link link-primary text-sm hover:link-hover"
      >
        Forgot your password?
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;