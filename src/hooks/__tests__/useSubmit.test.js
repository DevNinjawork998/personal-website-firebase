import { renderHook, act } from "@testing-library/react";
import useSubmit from "../useSubmit";

describe("useSubmit Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() => useSubmit());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(typeof result.current.submit).toBe("function");
  });

  test("submit function sets loading state correctly", async () => {
    const { result } = renderHook(() => useSubmit());

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.submit("test-url", { firstName: "John" });
    });

    expect(result.current.isLoading).toBe(true);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.isLoading).toBe(false);
  });

  test("submit function returns success response when random >= 0.5", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.7); // Greater than 0.5, should succeed

    const { result } = renderHook(() => useSubmit());

    await act(async () => {
      await result.current.submit("test-url", { firstName: "John" });
    });

    expect(result.current.response).toEqual({
      type: "success",
      message:
        "Thanks for your submission John, we will get back to you shortly!",
    });
    expect(result.current.isLoading).toBe(false);
  });

  test("submit function returns error response when random < 0.5", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.3); // Less than 0.5, should fail

    const { result } = renderHook(() => useSubmit());

    await act(async () => {
      await result.current.submit("test-url", { firstName: "John" });
    });

    expect(result.current.response).toEqual({
      type: "error",
      message: "Something went wrong, please try again later!",
    });
    expect(result.current.isLoading).toBe(false);
  });

  test("submit function handles different user names", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.7); // Should succeed

    const { result } = renderHook(() => useSubmit());

    await act(async () => {
      await result.current.submit("test-url", { firstName: "Jane" });
    });

    expect(result.current.response).toEqual({
      type: "success",
      message:
        "Thanks for your submission Jane, we will get back to you shortly!",
    });
  });

  test("submit function resets loading state on error", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.3); // Should fail

    const { result } = renderHook(() => useSubmit());

    act(() => {
      result.current.submit("test-url", { firstName: "John" });
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response.type).toBe("error");
  });
});
