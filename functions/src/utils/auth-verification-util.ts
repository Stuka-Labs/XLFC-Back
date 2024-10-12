export const authIsAdmin = (req) => {
  try {
    const uid = req["uid"];
    const admin = req["admin"];
    return uid.exists && admin.exists;
  } catch (err) {
    return false;
  }
};

export const authIsCoach = (req) => {
  try {
    const uid = req["uid"];
    const coach = req["coach"];
    return uid.exists && coach.exists;
  } catch (err) {
    return false;
  }
};

export const authIsUser = (req) => {
  try {
    const uid = req["uid"];
    return uid.exists;
  } catch (err) {
    return false;
  }
};

export const authIsPlayer = (req) => {
  try {
    const uid = req["uid"];
    const player = req["player"];
    return uid.exists && player.exists;
  } catch (err) {
    return false;
  }
};
