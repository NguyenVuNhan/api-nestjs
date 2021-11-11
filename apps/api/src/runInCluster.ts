import * as cluster from 'cluster';
import * as os from 'os';

export function runInCluster(bootstrap: () => void) {
  if ((cluster as unknown as cluster.Cluster).isMaster) {
    const numberOfCores = os.cpus().length;
    for (let i = 0; i < numberOfCores; i++) {
      (cluster as unknown as cluster.Cluster).fork();
    }
  } else {
    bootstrap();
  }
}
