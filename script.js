const payBtn = document.getElementById('payBtn');
const statusEl = document.getElementById('status');
const phoneInput = document.getElementById('phone');

function getSelectedPlan() {
  const r = document.querySelector('input[name="plan"]:checked');
  return r ? r.value : '30';
}

function show(msg, error = false) {
  statusEl.textContent = msg;
  statusEl.style.color = error ? '#ff8a8a' : '#aef1ff';
}

payBtn.addEventListener('click', async () => {
  const phone = phoneInput.value.trim();
  if (!/^(?:2547|07)\d{8}$/.test(phone)) {
    show('Enter a valid phone number (2547XXXXXXXX)', true);
    return;
  }

  const plan = getSelectedPlan();
  const amount = plan === '30' ? 20 : plan === '60' ? 50 : 200;

  const normalizedPhone = phone.startsWith('07') ? '254' + phone.slice(1) : phone;

  show('Sending STK Push... please wait.');
  payBtn.disabled = true;

  try {
    // Corrected URL pointing to the deployed Edge Function
    const response = await fetch('mbfbdehzvbxzktrxauuu.supabase.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: normalizedPhone,
        amount,
        plan
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.errorMessage || 'Payment failed.');

    show('STK Push sent! Check your phone and enter your M-Pesa PIN.');
  } catch (err) {
    show(err.message || 'An error occurred', true);
  } finally {
    payBtn.disabled = false;
  }
});
