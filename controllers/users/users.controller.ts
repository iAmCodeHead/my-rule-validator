import * as express from 'express';
import { validateInput } from "../../validator/validator";

const basePayload = {
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
        name: "Samson Akande",
        github: "@iAmCodeHead",
        email: "akandesamson12@gmail.com",
        mobile: "08148404629",
        twitter: "@the_CodeHead"
    }
}

export class UserController {
 /**
  * devInfo
  */
 public static devInfo(req: express.Request, res: express.Response): any {
     try {
         res.status(200).json(basePayload)
     } catch (error) {
        res.status(500).send(error);
     }
 }

 public static invalidRoute(req: express.Request, res: express.Response): any {
    try {
        res.status(404).json({
            message : "Invalid Route",
            status : "error",
            data: null
        })
    } catch (error) {
       res.status(500).send(error);
    }
}

 public static validateRule = (req: express.Request, res: express.Response): any => {
    try {
      const body = req.body;
      const response = validateInput(body);
      // response to return with data appended to the respose payload
      const status = response.status === "success" ? 200 : 400;
      res.status(status).json(response)
    } catch (err) {
      throw new Error(err)
    }
  }

}