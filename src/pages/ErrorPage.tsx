import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  const str = error?.message || error?.statusText || "";
  const phrase = "loading chunk";
  const isLoadChunkError = str.toLowerCase().includes(phrase.toLowerCase());

  const renderError = () => {
    if (isLoadChunkError) {
      return (
        <>
          <i>
            The application may have changed since your last usage or simply an
            issue with your internet connection
          </i>

          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try reloading
            </button>
          </div>
        </>
      );
    } else {
      return <i>{error.statusText || error.message}</i>;
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center h-screen text-center px-4"
      id="error-page"
    >
      <h1 className="text-3xl font-bold">Oops!</h1>

      <p className="my-2 text-lg">Sorry, something seems to be wrong.</p>

      <p className="text-gray-500">
        {error?.status === 404 ? <i>Page not Found</i> : renderError()}
      </p>
    </div>
  );
}
