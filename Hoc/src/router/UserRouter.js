import { Router } from "express";
import { getAllAuth, getDetailAuth, getUserInfor, logout, removeAuth, signIn, signUp, updateUserInfor,updatePassword  } from "../controllers/AuthControllers.js";
import { checkPermission } from "../middlewares/CheckPermission.js";
import { checkAuth } from "../middlewares/CheckAuth.js";

const routerAuth = Router()

routerAuth.post("/signup",signUp),
routerAuth.post("/signin",signIn),
routerAuth.get('/admin',getAllAuth),
routerAuth.get('/me',checkAuth,getUserInfor)
routerAuth.get('/logout',checkAuth,logout)
routerAuth.get('/:email',getDetailAuth)
routerAuth.delete('/:email',removeAuth)
//cap nhap thong tin ca nhan
routerAuth.put('/:id',checkPermission,updateUserInfor)
routerAuth.put('/password/:userId',checkAuth, updatePassword)

//

//routerAuth.put('/updateUser', checkAuth, updateUser);
export default routerAuth