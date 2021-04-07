import * as React from "react";
import * as renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

jest.mock('../components/Gauge', () => ({ Gauge: () => <div>io</div>}));

import { Url } from "../components/Url";

const report = require("../report.json").find(r => r.url==="https://www.lemonde.fr")

it("Should render empty Url", () => {
  const props = {};
  const tree = renderer.create(<Url {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Should render full Url", () => {
  const props = { report };
  const tree = renderer
    .create(
      <MemoryRouter>
        <Url {...props} />{" "}
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Tools config", () => {
  beforeEach(() => {
    jest.mock("../config.json", () => ({
      tools: ["http", "zap"],
    }));
   });
   
  it("Should render Url with limited tools", () => {
    const props = { report };
    const tree = renderer
      .create(
        <MemoryRouter>
          <Url {...props} />{" "}
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
