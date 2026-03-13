import { randomUUID } from "crypto";
import { planDefinitionsRepository } from "@platform/database";
import { builtInPlans } from "./plans";

export async function seedPlanDefinitions() {
  for (const plan of builtInPlans) {
    const existing = await planDefinitionsRepository.findByKey(plan.key);
    if (!existing) {
      await planDefinitionsRepository.create({
        id: randomUUID(),
        key: plan.key,
        name: plan.name,
        monthlyPriceCents: plan.monthlyPriceCents,
        limitsJson: plan.limits,
        isActive: true
      });
    }
  }
}
