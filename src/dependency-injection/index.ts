import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection';


let container: ContainerBuilder;

export const getContainer = async () => {
  if (container) {
    console.log('Container already loaded');
    return container;
  }
  container = new ContainerBuilder(true);
  const loader = new YamlFileLoader(container);
  const env = process.env.NODE_ENV || 'dev';

  const folder = `${import.meta.dirname}/application_${env}.yml`

  await loader.load(folder);
  console.log('Configuration loaded');
  //await container.compile();
  //console.log('Container compiled');
  return container;
}

