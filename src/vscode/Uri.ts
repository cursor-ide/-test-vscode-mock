export class Uri {
  private _scheme: string;
  private _authority: string;
  private _path: string;
  private _query: string;
  private _fragment: string;
  private _formatted: string | null = null;
  
  constructor(scheme: string, authority: string, path: string, query: string, fragment: string) {
    this._scheme = scheme;
    this._authority = authority;
    this._path = path;
    this._query = query;
    this._fragment = fragment;
  }
  
  get scheme(): string { return this._scheme; }
  get authority(): string { return this._authority; }
  get path(): string { return this._path; }
  get query(): string { return this._query; }
  get fragment(): string { return this._fragment; }
  
  get fsPath(): string {
    if (this._scheme !== 'file') {
      console.warn(`[Uri] Getting fsPath for non-file URI: ${this.toString()}`);
    }
    // Simplified: just return the path for now
    return this._path;
  }
  
  with(change: { 
    scheme?: string; 
    authority?: string; 
    path?: string; 
    query?: string; 
    fragment?: string 
  }): Uri {
    return new Uri(
      change.scheme ?? this._scheme,
      change.authority ?? this._authority,
      change.path ?? this._path,
      change.query ?? this._query,
      change.fragment ?? this._fragment
    );
  }
  
  static parse(value: string, strict = false): Uri {
    const match = value.match(/^([a-z][a-z0-9+.-]*):(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/i);
    
    if (!match) {
      if (strict) {
        throw new Error(`Invalid URI: ${value}`);
      }
      return new Uri('', '', value, '', '');
    }
    
    const [, scheme = '', authority = '', path = '', query = '', fragment = ''] = match;
    return new Uri(scheme, authority, path, query, fragment);
  }
  
  static file(path: string): Uri {
    // Handle Windows paths
    if (/^[a-zA-Z]:/.test(path)) {
      path = '/' + path.replace(/\\/g, '/');
    }
    
    return new Uri('file', '', path, '', '');
  }
  
  static joinPath(base: Uri, ...pathSegments: string[]): Uri {
    const joinedPath = pathSegments.reduce((path, segment) => {
      if (path.endsWith('/')) {
        return path + segment;
      }
      return path + '/' + segment;
    }, base.path);
    
    return base.with({ path: joinedPath });
  }
  
  toString(skipEncoding = false): string {
    if (!this._formatted || skipEncoding) {
      const parts: string[] = [];
      
      if (this._scheme) {
        parts.push(this._scheme, ':');
      }
      
      if (this._authority || this._scheme === 'file') {
        parts.push('//');
      }
      
      if (this._authority) {
        parts.push(this._authority);
      }
      
      if (this._path) {
        parts.push(this._path);
      }
      
      if (this._query) {
        parts.push('?', this._query);
      }
      
      if (this._fragment) {
        parts.push('#', this._fragment);
      }
      
      this._formatted = parts.join('');
    }
    
    return this._formatted;
  }
  
  toJSON(): any {
    return {
      $mid: 1,
      scheme: this._scheme,
      authority: this._authority,
      path: this._path,
      query: this._query,
      fragment: this._fragment
    };
  }
  
  static revive(data: any): Uri {
    if (data && data.$mid === 1) {
      return new Uri(data.scheme, data.authority, data.path, data.query, data.fragment);
    }
    return Uri.parse('');
  }
}