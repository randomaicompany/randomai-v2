<script>
  import * as R from "ramda";
  export let currentStep = 1;

  const isFistStep = R.gte(currentStep, 1);
  const isSecondStep = R.gte(currentStep, 2);
  const isLastStep = R.gte(currentStep, 3);
</script>

<div
  class:w-[20%]="{isFistStep}"
  class:w-[50%]="{isSecondStep}"
  class:w-[99.9%]="{isLastStep}"
  class="h-1.5 bg-brand-accent-light rounded-xl transition-all">
</div>
<div class="shell py-4">
  <ul class="flex items-center justify-between text-sm text-brand-tertiary">
    <li class:font-semibold="{isFistStep}" class:text-brand-primary="{isFistStep}">
      Select a style
    </li>
    <li class:font-semibold="{isSecondStep}" class:text-brand-primary="{isSecondStep}">
      Create with AI
    </li>
    <li class:font-semibold="{isLastStep}" class:text-brand-primary="{isLastStep}">Finalize</li>
  </ul>
</div>
