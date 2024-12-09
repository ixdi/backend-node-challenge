import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection';

let container: ContainerBuilder;

export const getContainer = async () => {
  if (container) {
    return container;
  }
  container = new ContainerBuilder(true);
  const loader = new YamlFileLoader(container);
  const env = process.env.NODE_ENV || 'dev';

  // const dirname = __dirname;
  const dirname = import.meta.dirname;
  const folder = `${dirname}/application_${env}.yml`

  await loader.load(folder);
  await container.compile();
  console.log('Container compiled');
  return container;
}

