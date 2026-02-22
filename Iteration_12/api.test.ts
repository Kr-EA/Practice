import * as api from "./api";

jest.spyOn(api, "getRepositories").mockResolvedValue("repo");

test("calls getRepositories with correct param", async () => {
  const result = await api.getRepositories('Kr-EA');

  expect(api.getRepositories).toHaveBeenCalledTimes(1);
  expect(api.getRepositories).toHaveBeenCalledWith('Kr-EA');
  expect(result).toBe("repo");
});