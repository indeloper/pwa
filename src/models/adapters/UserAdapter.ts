import type { UserResponse } from "../../types/auth";
import User from "../User";

export class UserAdapter {
    static adapt(data: UserResponse): User {
        return new User({
            id: data.id,
            email: data.email,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            patronymic: data.patronymic || '',
        });
    }
}