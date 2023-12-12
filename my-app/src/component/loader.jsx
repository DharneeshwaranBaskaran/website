import React, { useState } from "react";

function withLoader(LoaderComponent) {
  return (props) => {
    const [load, setLoad] = useState(true);
    setTimeout(() => {
      setLoad(false);
    }, 3000);

    return (
      <div>
        {load ? <p>Please Wait The Page is Loading......</p> : <LoaderComponent {...props} />}
      </div>
    );
  };
}

export default withLoader;
