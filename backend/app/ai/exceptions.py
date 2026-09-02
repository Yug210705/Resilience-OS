class AIIntegrationError(Exception):
    """Base class for AI integration exceptions."""
    pass

class AIProviderUnavailableError(AIIntegrationError):
    """Raised when the AI provider is not configured or unreachable."""
    pass

class AIResponseInvalidError(AIIntegrationError):
    """Raised when the AI provider returns a malformed response."""
    pass

class AIProviderTimeoutError(AIIntegrationError):
    """Raised when the AI provider times out."""
    pass

class AIHallucinationError(AIIntegrationError):
    """Raised when the AI provider recommends an unfeasible action."""
    pass
