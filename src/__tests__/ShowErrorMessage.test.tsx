import React from "react";
import { create } from "react-test-renderer";
import ShowErrorMessage from "components/ShowErrorMessage";



describe("Show error message component", () => {
    let errorObject={
        response:undefined,
        message:"errorMessage"
    }
    test("it shows the right message based on the error object supplied to it", () => {
      const component = create(<ShowErrorMessage error={errorObject} />);
      const rootInstance = component.root;
      const elementWithMessage = rootInstance.findByType("div");
      expect(elementWithMessage.props.children).toBe(errorObject.message);
    });
  });