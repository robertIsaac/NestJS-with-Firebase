import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { firestore } from 'firebase-admin';
import { REQUEST } from '@nestjs/core';
import { Todo } from './entities/todo.entity';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;

@Injectable()
export class TodoService {
  private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.collection = firestore().collection('todos');
  }

  async create(createTodoDto: CreateTodoDto) {
    const userId = this.request.user.uid;
    const todo: Omit<Todo, 'id'> = {
      ...createTodoDto,
      createdAt: new Date().toISOString(),
      userId,
    };

    return this.collection.add(todo).then((doc) => {
      return { id: doc.id, ...todo };
    });
  }

  findAll() {
    return this.collection
      .where('userId', '==', this.request.user.uid)
      .get()
      .then((querySnapshot: QuerySnapshot<Todo>) => {
        if (querySnapshot.empty) {
          return [];
        }

        const todos: Todo[] = [];
        for (const doc of querySnapshot.docs) {
          todos.push(this.transformTodo(doc));
        }

        return todos;
      });
  }

  findOne(id: string) {
    return this.collection
      .doc(id)
      .get()
      .then((querySnapshot: DocumentSnapshot<Todo>) => {
        return this.transformTodo(querySnapshot);
      });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    await this.collection.doc(id).update(updateTodoDto);
  }

  async remove(id: string) {
    await this.collection.doc(id).delete();
  }

  private transformTodo(querySnapshot: DocumentSnapshot<Todo>) {
    if (!querySnapshot.exists) {
      throw new Error(`no todo found with the given id`);
    }

    const todo = querySnapshot.data();
    const userId = this.request.user.uid;

    if (todo.userId !== userId) {
      throw new Error(`no todo found with the given id`);
    }

    return {
      id: querySnapshot.id,
      ...todo,
    };
  }
}
