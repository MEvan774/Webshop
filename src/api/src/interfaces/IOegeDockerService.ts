@Interface
/**
 * Abstract function to connect to any API when the port and container name is provided
 */
export abstract class IOegeDockerService {
    public abstract connectAPI(port: number, containerName: string, gameId: string | undefined): Promise<void>;
}
