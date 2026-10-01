import {initializeApp} from "firebase-admin/app";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {HttpsError, onCall, onRequest} from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();

setGlobalOptions({maxInstances: 10});

export const healthCheck = onRequest((request, response) => {
  response.status(200).json({
    status: "ok",
    service: "ArchConnect-KE Functions",
  });
});

export const updateUserStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in."
    );
  }

  const adminRef = db.doc(`admins/${request.auth.uid}`);
  const adminSnap = await adminRef.get();

  if (!adminSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "You are not authorized as an admin."
    );
  }

  const adminData = adminSnap.data();

  if (
    adminData?.role !== "admin" ||
    adminData?.active !== true
  ) {
    throw new HttpsError(
      "permission-denied",
      "Your admin account is inactive or unauthorized."
    );
  }

  const userId = request.data?.userId;
  const status = request.data?.status;

  if (
    typeof userId !== "string" ||
    typeof status !== "string"
  ) {
    throw new HttpsError(
      "invalid-argument",
      "userId and status are required."
    );
  }

  if (status !== "active" && status !== "suspended") {
    throw new HttpsError(
      "invalid-argument",
      "Invalid user status."
    );
  }

  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new HttpsError(
      "not-found",
      "User not found."
    );
  }

  await userRef.update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    userId,
    status,
  };
});

export const updateProfessionalVerification = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in."
    );
  }

  const adminRef = db.doc(`admins/${request.auth.uid}`);
  const adminSnap = await adminRef.get();

  if (!adminSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "You are not authorized as an admin."
    );
  }

  const adminData = adminSnap.data();

  if (
    adminData?.role !== "admin" ||
    adminData?.active !== true
  ) {
    throw new HttpsError(
      "permission-denied",
      "Your admin account is inactive or unauthorized."
    );
  }

  const professionalId = request.data?.professionalId;
  const boraqsVerified = request.data?.boraqsVerified;

  if (
    typeof professionalId !== "string" ||
    typeof boraqsVerified !== "boolean"
  ) {
    throw new HttpsError(
      "invalid-argument",
      "professionalId and boraqsVerified are required."
    );
  }

  const professionalRef = db.doc(
    `professionals/${professionalId}`
  );

  const professionalSnap = await professionalRef.get();

  if (!professionalSnap.exists) {
    throw new HttpsError(
      "not-found",
      "Professional not found."
    );
  }

  await professionalRef.update({
    boraqsVerified,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    professionalId,
    boraqsVerified,
  };
});
export const createProject = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in."
    );
  }

  const userRef = db.doc(`users/${request.auth.uid}`);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new HttpsError(
      "not-found",
      "User profile not found."
    );
  }

  const userData = userSnap.data();

  if (
    userData?.role !== "client" ||
    userData?.status !== "active"
  ) {
    throw new HttpsError(
      "permission-denied",
      "Only active clients can create projects."
    );
  }

  const title = request.data?.title;
  const category = request.data?.category;
  const location = request.data?.location;
  const budgetMinKsh = request.data?.budgetMinKsh;
  const budgetMaxKsh = request.data?.budgetMaxKsh;

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    title.trim().length > 200
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid project title is required."
    );
  }

  if (
    typeof category !== "string" ||
    category.trim().length === 0 ||
    category.trim().length > 100
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid project category is required."
    );
  }

  if (
    typeof location !== "string" ||
    location.trim().length === 0 ||
    location.trim().length > 200
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid project location is required."
    );
  }

  if (
    typeof budgetMinKsh !== "number" ||
    !Number.isFinite(budgetMinKsh) ||
    budgetMinKsh <= 0
  ) {
    throw new HttpsError(
      "invalid-argument",
      "budgetMinKsh must be a positive number."
    );
  }

  if (
    typeof budgetMaxKsh !== "number" ||
    !Number.isFinite(budgetMaxKsh) ||
    budgetMaxKsh < budgetMinKsh
  ) {
    throw new HttpsError(
      "invalid-argument",
      "budgetMaxKsh must be greater than or equal to budgetMinKsh."
    );
  }

  const projectRef = db.collection("projects").doc();

  await projectRef.set({
    title: title.trim(),
    clientId: request.auth.uid,
    category: category.trim(),
    location: location.trim(),
    budgetMinKsh,
    budgetMaxKsh,
    status: "open",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    projectId: projectRef.id,
  };
});
