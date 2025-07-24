import { useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";
import { Award } from "lucide-react";

export default function ResultCard() {
  const { id } = useParams();
  const { resultQuery } = useInterview(id);
  if (resultQuery.isLoading)
    return <span className="loading loading-spinner text-primary"></span>;

  const data = resultQuery.data;
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Award size={20} className="mr-2" />
              Interview Results
            </h2>
            {data.answers.map((a, i) => (
              <div key={i} className="collapse collapse-arrow border">
                <input type="radio" name="result-accordion" defaultChecked={i === 0} />
                <div className="collapse-title font-medium">{a.question}</div>
                <div className="collapse-content">
                  <p className="font-semibold text-success">Your Answer:</p>
                  <p>{a.answer}</p>
                  <p className="font-semibold text-info mt-2">Feedback:</p>
                  <p>{a.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}