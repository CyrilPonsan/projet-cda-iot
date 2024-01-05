import { RefreshCw, WifiOff } from "lucide-react";

interface ViewHeaderProps {
  networkIssue: boolean;
  onRefresh: () => void;
}

export default function ViewHeader({
  networkIssue,
  onRefresh,
}: ViewHeaderProps) {
  return (
    <>
      <div className="w-full flex items-center">
        {networkIssue ? (
          <div className="badge badge-accent">
            Dernières données enregistrées
          </div>
        ) : null}
        <div className="flex flex-1 justify-end items-center gap-x-2">
          {networkIssue ? (
            <span
              className="tooltip tooltip-left cursor-pointer"
              data-tip="Pas de connexion internet"
              aria-label="indicateur d'absence de réseau internet"
            >
              <WifiOff className="text-warning" />
            </span>
          ) : null}
          <span
            className="tooltip tooltip-left cursor-pointer"
            data-tip="Rafraîchir les données"
            aria-label="recharger la liste des données"
          >
            <RefreshCw className="text-primary" onClick={onRefresh} />
          </span>
        </div>
      </div>
      <div className="divider" />
    </>
  );
}
