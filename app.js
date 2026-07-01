let direction = "long";

function euro(value) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function setDirection(newDirection) {
  direction = newDirection;

  document.getElementById("longBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");

  if (direction === "long") {
    document.getElementById("longBtn").classList.add("active");
  } else {
    document.getElementById("shortBtn").classList.add("active");
  }
}

document.getElementById("longBtn").onclick = function () {
  setDirection("long");
};

document.getElementById("shortBtn").onclick = function () {
  setDirection("short");
};

function calculate() {
  const balance = Number(document.getElementById("balance").value);
  const riskPercent = Number(document.getElementById("risk").value);
  const leverage = Number(document.getElementById("leverage").value);
  const entry = Number(document.getElementById("entry").value);
  const stop = Number(document.getElementById("stop").value);

  if (!balance || !riskPercent || !leverage || !entry || !stop) {
    document.getElementById("status").innerText = "Bitte alle Felder ausfüllen";
    return;
  }

  if (direction === "long" && stop >= entry) {
    document.getElementById("status").innerText = "Long: Stop muss unter Einstieg sein";
    return;
  }

  if (direction === "short" && stop <= entry) {
    document.getElementById("status").innerText = "Short: Stop muss über Einstieg sein";
    return;
  }

  const riskEuro = balance * (riskPercent / 100);
  const stopDistance = Math.abs(entry - stop) / entry;
  const positionSize = riskEuro / stopDistance;
  const margin = positionSize / leverage;

  const tp2 = direction === "long"
    ? entry + (entry * stopDistance * 2)
    : entry - (entry * stopDistance * 2);

  const tp3 = direction === "long"
    ? entry + (entry * stopDistance * 3)
    : entry - (entry * stopDistance * 3);

  document.getElementById("loss").innerText = euro(riskEuro);
  document.getElementById("distance").innerText = (stopDistance * 100).toFixed(2) + " %";
  document.getElementById("position").innerText = euro(positionSize);
  document.getElementById("margin").innerText = euro(margin);
  document.getElementById("tp2").innerText = tp2.toFixed(2);
  document.getElementById("tp3").innerText = tp3.toFixed(2);

  if (margin > balance) {
    document.getElementById("status").innerText = "Margin größer als Konto";
  } else if (riskPercent > 2) {
    document.getElementById("status").innerText = "Risiko hoch";
  } else {
    document.getElementById("status").innerText = "OK";
  }
}

calculate();
