import { it, expect, describe } from "vitest"
import React from "../core/React"
describe("createElement ", () => {
	it("should return vdom for element and props is null", () => {
		const el = React.createElement("div", null, "hello world!")
		expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello world!",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
	})

	it("should return vdom for element and props is null", () => {
		const el = React.createElement(
			"div",
			{ id: "id", class: "class" },
			"hello world!"
		)
		expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello world!",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "class": "class",
          "id": "id",
        },
        "type": "div",
      }
    `)
	})
})
