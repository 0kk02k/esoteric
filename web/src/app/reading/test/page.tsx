import { notFound } from "next/navigation";
import PipelineClient from "./pipeline-client";

/**
 * Interne Pipeline-Testseite — ruft den KI-Stack direkt auf und gehört in einer
 * geschlossenen Beta nicht in öffentliche Hände. Nur mit explizitem Env-Flag.
 */
export default function ReadingTestPage() {
  if (process.env.ESO_ENABLE_PIPELINE_TEST !== "1") {
    notFound();
  }
  return <PipelineClient />;
}
