import { all, call } from "redux-saga/effects";
import { fetchCollectionsStart, shopSagas } from "./shop/shop.sagas";
import { userSagas } from "./user/user.sagas";
import { cartSagas } from "./cart/cart.sagas";

export default function* rootSaga() {
  yield all([
    call(fetchCollectionsStart),
    call(userSagas),
    call(cartSagas),
    call(shopSagas),
  ]);
}

// all take an array of Sagas
// we could write
// yield saga1();
// yield saga2();
// yield saga3();
// but it won't run all sagas concurrently
// all run all sagas concurrently
