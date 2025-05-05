import { Application } from 'express';
import { BaseRoute } from './baseRoute';
import { UserRepository } from '../repositories/userRepository';
import { UserService } from '../services/userService';
import { UserController } from '../controller/userController';
import { AuthMiddleware } from '../middlewares/authMiddlewares';

export class UserRoute extends BaseRoute {
  userRepository: UserRepository;
  userService: UserService;
  userController: UserController;
  constructor(app: Application) {
    super(app);
    this.userRepository = new UserRepository();
    this.userService = new UserService(this.userRepository);
    this.userController = new UserController(this.userService);
    this.initGetHttpMethod();
    this.initDeleteHttpMethod();
    this.initUpdateHttpMethod();
  }

  private initGetHttpMethod = async () => {
    this.router.get(
      '/getAllUsers',
      AuthMiddleware.authenticate,
      this.userController.getAllUsers
    );
    this.router.get(
      '/:id/getUserById',
      AuthMiddleware.authenticate,
      this.userController.getUserById
    );
    this.router.get('/:id/getUserLastActivity', this.userController.getUserLastActivity);
  };
  private initDeleteHttpMethod = async () => {
    this.router.delete(
      '/deleteUser',
      AuthMiddleware.authenticate,
      this.userController.deleteUser
    );
  };
  private initUpdateHttpMethod = async () => {
    this.router.patch(
      '/updateUser',
      AuthMiddleware.authenticate,
      this.userController.updateUser
    );
  };
}
