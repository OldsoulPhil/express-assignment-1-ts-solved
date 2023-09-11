import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
import { checkBodyKeys, typeValidations } from "./misc";
import { Dog } from "@prisma/client";

const app = express();
app.use(express.json());
// All code should go below this line

// * Example
app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200); // the 'status' is unnecessary but wanted to show you how to define a status
});

// * Index
app.get("/dogs", async (_req, res) => {
  const dogs = await prisma.dog.findMany();
  if (!dogs) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  return res.status(200).send(dogs);
});

// * Show Specific Dog
app.get("/dogs/:id", async (req, res) => {
  if (!+req.params.id) {
    return res
      .status(400)
      .send({ message: "id should be a number" });
  }
  const id = +req.params.id;

  const dog = await prisma.dog.findUnique({
    where: {
      id,
    },
  });

  if (!dog) {
    return res
      .status(204)
      .send({ error: "Dog does not exist" });
  }

  return res.status(200).send(dog);
});

// * Create dog
app.post("/dogs", async (req, res) => {
  const body: Dog = {
    ...req.body,
  };

  let errors: string[] = [];

  errors = checkBodyKeys(body);

  errors = [...errors, ...typeValidations(errors, body)];

  if (errors.length !== 0)
    return res.status(400).send({ errors });

  try {
    const dog = await prisma.dog.create({
      data: body,
    });
    return res.status(201).send(dog);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// * Update Dog
app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const body = req.body;

  if (!body || !id) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  let errors: string[] = [];

  errors = [...errors, ...checkBodyKeys(body)];

  if (errors.length !== 0)
    return res.status(400).send({ errors });

  try {
    const dog = await prisma.dog.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(201).send(dog);
  } catch (error) {
    res
      .status(400)
      .send({ errorMessage: "There was an error", error });
  }
});

// * Delete Dog
app.delete("/dogs/:id", async (req, res) => {
  const id = +req.params.id;

  const deleted = await prisma.dog
    .delete({
      where: {
        id,
      },
    })
    .catch(() => null);

  if (isNaN(id)) {
    res
      .status(400)
      .send({ message: "id should be a number" });
  }

  if (deleted === null) {
    res.status(204).send({ error: "Dog not found" });
  }
  return res.status(200).send(deleted);
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
