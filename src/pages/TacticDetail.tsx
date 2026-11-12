import { Link, useParams } from 'react-router-dom';
import { BASE_TACTICS } from '../lib/queries';
import { useApp } from '../lib/store';
import TacticView from '../components/TacticView';

export default function TacticDetail() {
  const { tacticId = '' } = useParams();
  const { userTactics } = useApp();
  const tactic = [...userTactics, ...BASE_TACTICS].find((t) => t.id === tacticId);

  if (!tactic) {
    return (
      <div>
        <div className="badbox">
          Taktik „{tacticId}“ wurde nicht gefunden – möglicherweise wurde sie gelöscht.{' '}
          <Link to="/maps">Zur Kartenliste</Link> · <Link to="/editor">Zum Editor</Link>
        </div>
      </div>
    );
  }
  return <TacticView tactic={tactic} />;
}
